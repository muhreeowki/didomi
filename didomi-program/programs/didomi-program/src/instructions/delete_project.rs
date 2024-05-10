use crate::{state::ProjectData, EscrowData};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DeleteProject<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, seeds = [owner.key().as_ref(), "coolproject".as_ref()], bump, close = owner)]
    pub project: Account<'info, ProjectData>,
    #[account(mut, seeds = [owner.key().as_ref(), project.key().as_ref()], bump,close = owner)]
    pub escrow: Account<'info, EscrowData>,
    pub system_program: Program<'info, System>,
}

pub fn delete_project_handler(_ctx: Context<DeleteProject>) -> Result<()> {
    Ok(())
}
