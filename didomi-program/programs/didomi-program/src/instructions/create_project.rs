use anchor_lang::prelude::*;
use std::mem::size_of;

use crate::state::ProjectData;

#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,
    #[account(init,  payer = organizer, space = 512, seeds = [organizer.key().as_ref()], bump)]
    pub project: Account<'info, ProjectData>,
    pub system_program: Program<'info, System>,
}

pub fn create_project_handler(
    ctx: Context<CreateProject>,
    title: [u8; 64],
    description: [u8; 256],
    organizer_name: [u8; 24],
    target_amount: u64,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    // Initialize Project
    project.title = title;
    project.description = description;
    project.organizer_name = organizer_name;
    project.target_amount = target_amount;
    project.organizer_address = ctx.accounts.organizer.key();
    Ok(())
}
