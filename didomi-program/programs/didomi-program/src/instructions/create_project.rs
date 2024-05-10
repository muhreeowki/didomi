use anchor_lang::prelude::*;

use crate::{state::ProjectData, EscrowData};

#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init,  payer = owner, space = 512, seeds = [owner.key().as_ref(), "coolproject".as_ref()], bump)]
    pub project: Account<'info, ProjectData>,
    /// CHECK: This is a pda
    #[account(init,  payer = owner, space = 128, seeds = [owner.key().as_ref(), project.key().as_ref()], bump)]
    pub escrow: Account<'info, EscrowData>,
    pub system_program: Program<'info, System>,
}

pub fn create_project_handler(
    ctx: Context<CreateProject>,
    id: u64,
    owner_id: u64,
    title: [u8; 64],
    target_amount: u64,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    // Initialize Project
    project.id = id;
    project.title = title;
    project.target_amount = target_amount;
    project.current_amount = 0;
    project.owner_id = owner_id;
    project.owner_address = ctx.accounts.owner.key();
    project.escrow_address = ctx.accounts.escrow.key();
    Ok(())
}
