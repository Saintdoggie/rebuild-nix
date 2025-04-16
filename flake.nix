
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }: 
  let 
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    name = "rebuild";
  in
  with pkgs;
  {
    packages.${system}.default = stdenv.mkDerivation {
      inherit name;
      src = ./.;

      buildInputs = [
        bun
      ];
      

      buildPhase = ''
        ${bun}/bin/bun build $src/src/index.ts \
        --compile \
        --bytecode \
        --outfile rebuild
     '';

      installPhase = ''
        mkdir -p $out/bin

        cp rebuild $out/bin

        chmod +x $out/bin/rebuild
      '';

    };
  };
}
