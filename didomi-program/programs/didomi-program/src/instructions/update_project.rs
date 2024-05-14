use anchor_lang::prelude::*;

use crate::{state::ProjectData, EscrowData};

#[derive(Accounts)]
pub struct UpdateProject<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init,  payer = owner, space = 256 + 8, seeds = [owner.key().as_ref(), b"coolproject"], bump)]
    pub project: Account<'info, ProjectData>,
    /// CHECK: This is a pda
    #[account(init,  payer = owner, space = 128 + 8, seeds = [owner.key().as_ref(), project.key().as_ref()], bump)]
    pub escrow: Account<'info, EscrowData>,
    pub system_program: Program<'info, System>,
}

pub fn update_project_handler(
    ctx: Context<UpdateProject>,
    title: [u8; 64],
    target_amount: u64,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    // Update Project Fields
    project.title = title;
    project.target_amount = target_amount;
    Ok(())
}
