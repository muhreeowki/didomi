import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DidomiProgram, IDL } from "../target/types/didomi_program";
import axios from "axios";

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
        new anchor.BN(1),
        new anchor.BN(1234),
        Array.from(anchor.utils.bytes.bs58.decode("Swagy")),
        new anchor.BN(4321),
      )
      .accounts({
        project: projectDataAccount,
        owner: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const projectAccount = await program.account.projectData.fetch(
      projectDataAccount
    );

    // Check if user exists
    let userObject: any = {};
    await axios
      .get(`http://localhost:3000/users/${program.provider.publicKey}`)
      .then(async (data) => {
        if (data) {
          userObject = data.data;
        } else {
          // Create if user doesnt exist
          await axios
            .post(`http://localhost:3000/users`, {
              walletAddress: program.provider.publicKey,
            })
            .then((data) => {
              userObject = data.data;
            });
        }
      });

    console.log("USER DATA");
    console.log(userObject);
    // Create Project in DB
    await axios
      .post("http://localhost:3000/projects", {
        accountAddress: projectDataAccount.toString(),
        name: "Test Project",
        story: "This is a short story of this test project",
        targetAmount: 12500,
        endDate: "2020-04-30T04:00:00.000Z",
        ownerId: `${userObject.id}`,
        owner: {
          connect: {
            walletAddress: userObject.walletAddress,
          },
        },
      })
      .then((data) => console.log(data));
  });
});
