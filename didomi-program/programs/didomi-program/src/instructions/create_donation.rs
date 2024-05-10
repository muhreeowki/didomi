use anchor_lang::prelude::*;
use solana_program::system_instruction;

use crate::{state::Donation, ProjectData};

#[derive(Accounts)]
pub struct CreateDonation<'info> {
    #[account()]
    #[account(mut)]
    pub donor: Signer<'info>,
    #[account(init_if_needed, payer = donor, space = 256, seeds = ["donation".as_ref(), donor.key().as_ref(), project_account.key().as_ref()], bump)]
    pub donation: Account<'info, Donation>,
    #[account(mut)]
    pub project_account: Account<'info, ProjectData>,
    /// CHECK: Checking that this account is the same as the one in the project provided
    #[account(mut, seeds = [project_account.owner_address.as_ref(), project_account.key().as_ref()], bump)]
    pub project_escrow: AccountInfo<'info>,
    system_program: Program<'info, System>,
}

pub fn create_donation_handler(
    ctx: Context<CreateDonation>,
    amount: u64,
    token_type: u8,
) -> Result<()> {
    let donor = &mut ctx.accounts.donor;
    let donation = &mut ctx.accounts.donation;
    let project = &mut ctx.accounts.project_account;
    let escrow = &mut ctx.accounts.project_escrow;
    // Intialize Donation
    donation.amount += amount;
    donation.token_type = token_type;
    donation.donor = donor.key();
    donation.project = project.key();
    // Making the Donation
    // Create the transfer instruction
    let transfer_instruction =
        system_instruction::transfer(&donor.key(), escrow.key, donation.amount);
    // Invoke the transfer instruction
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            donor.to_account_info(),
            escrow.clone(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;
    /*
    TODO: Record Donations in USD
    Record Donation
    */
    project.current_amount += donation.amount / 1000000000; // SOL
    Ok(())
}
