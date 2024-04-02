use anchor_lang::prelude::*;
use solana_program::system_instruction;
use std::mem::size_of;

use crate::{state::Contribution, Contributor, ProjectData};

#[derive(Accounts)]
pub struct CreateContribution<'info> {
    #[account(mut)]
    contributor: Signer<'info>,
    #[account(init_if_needed, payer = contributor, space = 8, seeds = [contributor.key().as_ref()], bump)]
    contributor_account: Account<'info, Contributor>,
    #[account(init, payer = contributor, space = size_of::<Contribution>(), seeds = [contributor.key().as_ref()], bump)]
    contribution: Account<'info, Contribution>,
    #[account(mut)]
    project_account: Account<'info, ProjectData>,
    /// CHECK: Checking that this account is the same as the one in the project provided
    #[account(mut, address = project_account.beneficiary_address)]
    beneficiary_account: AccountInfo<'info>,
    system_program: Program<'info, System>,
}

pub fn create_contribution_handler(
    ctx: Context<CreateContribution>,
    data: Contribution,
) -> Result<()> {
    let contributor = &mut ctx.accounts.contributor_account;
    let contribution = &mut ctx.accounts.contribution;
    let project = &mut ctx.accounts.project_account;
    let beneficiary = &mut ctx.accounts.beneficiary_account;
    // Intialize Contribution
    **contribution = data;
    // Making the Donation
    // Create the transfer instruction
    let transfer_instruction =
        system_instruction::transfer(&contributor.key(), beneficiary.key, contribution.amount);
    // Invoke the transfer instruction
    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            contributor.to_account_info(),
            beneficiary.clone(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;
    /*
    TODO: Record Donations in USD
    Record Donation
    */
    project.current_amount += contribution.amount / 1000000000; // SOL
    project.total_contributions += 1;
    contributor.total_contributions += 1;
    Ok(())
}