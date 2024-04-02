use anchor_lang::prelude::*;

use crate::state::ProjectData;

#[derive(Accounts)]
pub struct UpdateProject<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(seeds = [owner.key().as_ref()], bump)]
    pub project: Account<'info, ProjectData>,
    pub system_program: Program<'info, System>,
}

pub fn update_project_handler(ctx: Context<UpdateProject>, data: ProjectData) -> Result<()> {
    let project = &mut ctx.accounts.project;
    // Initialize Project
    **project = ProjectData { ..data };
    Ok(())
}
