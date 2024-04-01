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
    // **project = ProjectData { ..data };
    project.title = data.title;
    project.description = data.description;
    project.target_amount = data.target_amount;
    project.current_amount = data.current_amount;
    project.start_date = data.start_date;
    project.end_date = data.end_date;
    project.owner_address = data.owner_address;
    project.beneficiary_address = data.beneficiary_address;
    project.project_status = data.project_status;
    project.images = data.images;
    project.project_url = data.project_url;
    project.organizer_name = data.organizer_name;
    project.project_type = data.project_type;
    Ok(())
}
