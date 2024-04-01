use anchor_lang::prelude::*;
use std::mem::size_of;

use crate::state::ProjectData;

#[derive(Accounts)]
pub struct DeleteProject<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(seeds = [owner.key().as_ref()], bump, close = owner)]
    pub project: Account<'info, ProjectData>,
    pub system_program: Program<'info, System>,
}

pub fn delete_project_handler(ctx: Context<DeleteProject>, data: ProjectData) -> Result<()> {
    Ok(())
}
