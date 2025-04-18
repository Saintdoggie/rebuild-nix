
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
        phases = [
        "unpackPhase"  
        "buildPhase" 
        "installPhase"
    ];
      

      buildPhase = ''
        ${bun}/bin/bun build $src/src/index.ts \
        --compile \
        --bytecode \
        --outfile rebuild
     '';

      installPhase = ''
        mkdir -p $out

        cp rebuild $out

        chmod +x $out/rebuild
      '';

    };
  };
}
