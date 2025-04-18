// TODO: Add colmena support

import { spawn } from "bun";

const flags = {
  nixDirectory:
    process.env.NIX_CONFIG_DIRECTORY || "/home/Saintdoggie/files/nix",
};

(async function () {
  const help = `rebuild [system]`;

  // clean
  await executeArbitrary(`sudo mkdir -p /etc/nixos`);
  await executeArbitrary(`sudo rm -r /etc/nixos`);
  await executeArbitrary(`sudo mkdir -p /etc/nixos`);
  // copy fresh config
  await executeArbitrary(`sudo cp -r ${flags.nixDirectory}/. /etc/nixos`);

  // apply
  const nixProcess = spawn([
    "sudo",
    "nixos-rebuild",
    "switch",
    "--flake",
    "/etc/nixos#computer",
  ]);

  // output everything that nix spits out without any modifications
  const reader = nixProcess.stdout.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    } else {
      process.stdout.write(value);
    }
  }
})();

async function executeArbitrary(args: string) {
  const result = spawn(args.split(" "));
  const reader = result.readable.getReader();

  let response = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    } else {
      response += String.fromCharCode(...Array.from(value));
    }
  }

  return response
}
