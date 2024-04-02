import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DidomiProgram } from "../target/types/didomi_program";

describe("didomi-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DidomiProgram as Program<DidomiProgram>;


  it("Is initialized!", async () => {
    // Create pda for project account
    const [projectAccount] = anchor.web3.PublicKey.findProgramAddressSync([program.provider.publicKey.toBuffer()], program.programId);
    
    // Call Create Instruction
    const tx = await program.methods.createProject({
      target_amount: new anchor.BN(10),
    }).accounts({
      project: projectAccount,
      owner: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).rpc();
    console.log("Your transaction signature", tx);
    console.log((await program.account.projectData.fetch(projectAccount)).title);
  });
});
