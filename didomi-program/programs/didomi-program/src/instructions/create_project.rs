use anchor_lang::prelude::*;
use std::mem::size_of;

use crate::state::ProjectData;

#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init,  payer = owner, space = size_of::<ProjectData>(), seeds = [owner.key().as_ref()], bump)]
    pub project: Account<'info, ProjectData>,
    pub system_program: Program<'info, System>,
}

pub fn create_project_handler(ctx: Context<CreateProject>, data: ProjectData) -> Result<()> {
    let project = &mut ctx.accounts.project;
    // Initialize Project
    **project = ProjectData { ..data };
    Ok(())
}
