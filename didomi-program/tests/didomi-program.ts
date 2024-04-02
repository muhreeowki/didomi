import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DidomiProgram, IDL } from "../target/types/didomi_program";

describe("didomi-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DidomiProgram as Program<DidomiProgram>;

  it("Is initialized!", async () => {
    // Create pda for project account
    const [projectDataAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [program.provider.publicKey.toBuffer()],
      program.programId
    );

    // Call Create Instruction
    const tx = await program.methods
      .createProject(
        Array.from(anchor.utils.bytes.bs58.decode("Swagy")),
        Array.from(anchor.utils.bytes.bs58.decode("TestyTesty")),
        Array.from(anchor.utils.bytes.bs58.decode("Johny")),
        new anchor.BN(1000)
      )
      .accounts({
        project: projectDataAccount,
        organizer: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const projectAccount = await program.account.projectData.fetch(
      projectDataAccount
    );
    console.log("PROJECT DATA: ");
    console.log(projectAccount);
  });
});
