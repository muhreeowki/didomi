use anchor_lang::prelude::*;

use crate::state::ProjectData;

#[derive(Accounts)]
pub struct UpdateProject<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,
    /// CHECK: Any address is fine.
    // pub beneficiary: AccountInfo<'info>,
    #[account(seeds = [organizer.key().as_ref()], bump)]
    pub project: Account<'info, ProjectData>,
    pub system_program: Program<'info, System>,
}

pub fn update_project_handler(
    ctx: Context<UpdateProject>,
    title: [u8; 64],
    description: [u8; 256],
    organizer_name: [u8; 24],
    target_amount: u64,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    project.title = title;
    project.description = description;
    project.organizer_name = organizer_name;
    project.target_amount = target_amount;
    project.organizer_address = ctx.accounts.organizer.key();
    // project.beneficiary_address = ctx.accounts.beneficiary.key();
    Ok(())
}
