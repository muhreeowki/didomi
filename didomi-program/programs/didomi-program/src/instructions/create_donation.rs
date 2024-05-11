use anchor_lang::prelude::*;
use solana_program::system_instruction;

use crate::state::{EscrowData, ProjectData};

#[derive(Accounts)]
pub struct CreateDonation<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    ///CHECK: Checking to see if the owner is the project address owner
    #[account()]
    pub project_owner: AccountInfo<'info>,

    #[account(mut, seeds = [project_owner.key().as_ref(), b"coolproject"], bump)]
    pub project_account: Account<'info, ProjectData>,

    /// CHECK: Checking that this account is the same as the one in the project provided
    #[account(mut, seeds = [project_account.owner_address.as_ref(), project_account.key().as_ref()], bump)]
    pub project_escrow: Account<'info, EscrowData>,

    pub system_program: Program<'info, System>,
}

pub fn create_donation_handler(
    ctx: Context<CreateDonation>,
    amount: u64,
    _token_type: u8,
) -> Result<()> {
    let donor = &mut ctx.accounts.donor;
    let project = &mut ctx.accounts.project_account;
    let escrow = &mut ctx.accounts.project_escrow;
    // Making the Donation
    // Create the transfer instruction
    let transfer_instruction = system_instruction::transfer(&donor.key(), &escrow.key(), amount);
    // Invoke the transfer instruction
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            donor.to_account_info(),
            escrow.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;
    /*
    TODO: Record Donations in USD
    Record Donation
    */
    project.current_amount += amount / 1000000000; // SOL
    Ok(())
}
