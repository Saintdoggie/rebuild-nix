// TODO: Add colmena support

const { $, spawn } = require("bun");

const flags = {
	nixDirectory: process.env.NIX_CONFIG_DIRECTORY || "~/files/nix" ,
};

(async function () {
  const help = `rebuild [system]`;

  // clean
  await $`sudo mkdir -p /etc/nixos`;
  await $`sudo rm -r /etc/nixos`;
  await $`sudo mkdir -p /etc/nixos`;
  // copy fresh config
  await $`sudo cp -r ${flags.nixDirectory}/* /etc/nixos`;

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
