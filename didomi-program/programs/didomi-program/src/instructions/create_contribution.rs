use anchor_lang::prelude::*;
use solana_program::system_instruction;

use crate::{state::Contribution, ProjectData};

#[derive(Accounts)]
pub struct CreateContribution<'info> {
    #[account(mut)]
    contributor: Signer<'info>,
    #[account(init_if_needed, payer = contributor, space = 256, seeds = ["contribution".as_ref(), contributor.key().as_ref(), project_account.key().as_ref()], bump)]
    contribution: Account<'info, Contribution>,
    #[account(mut)]
    project_account: Account<'info, ProjectData>,
    /// CHECK: Checking that this account is the same as the one in the project provided
    #[account(mut, address = project_account.owner_address)]
    project_organizer: AccountInfo<'info>,
    system_program: Program<'info, System>,
}

pub fn create_contribution_handler(
    ctx: Context<CreateContribution>,
    id: u64,
    amount: u64,
    token_type: u8,
) -> Result<()> {
    let contributor = &mut ctx.accounts.contributor;
    let contribution = &mut ctx.accounts.contribution;
    let project = &mut ctx.accounts.project_account;
    let project_organizer = &mut ctx.accounts.project_organizer;
    // Intialize Contribution
    contribution.id = id;
    contribution.amount += amount;
    contribution.token_type = token_type;
    contribution.contributor = contributor.key();
    contribution.project = project.key();
    // Making the Donation
    // Create the transfer instruction
    let transfer_instruction = system_instruction::transfer(
        &contributor.key(),
        project_organizer.key,
        contribution.amount,
    );
    // Invoke the transfer instruction
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            contributor.to_account_info(),
            project_organizer.clone(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;
    /*
    TODO: Record Donations in USD
    Record Donation
    */
    project.current_amount += contribution.amount / 1000000000; // SOL
    Ok(())
}
