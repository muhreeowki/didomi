use anchor_lang::prelude::*;

use crate::state::ProjectData;

#[derive(Accounts)]
pub struct UpdateProject<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init,  payer = owner, space = 512, seeds = [owner.key().as_ref()], bump)]
    pub project: Account<'info, ProjectData>,
    pub system_program: Program<'info, System>,
}

pub fn update_project_handler(
    ctx: Context<UpdateProject>,
    id: u64,
    name: [u8; 32],
    start_date: i64,
    end_date: i64,
    target_amount: u64,
    status: u8,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    project.id = id;
    project.name = name;
    project.start_date = start_date;
    project.end_date = end_date;
    project.target_amount = target_amount;
    project.owner = ctx.accounts.owner.key();
    project.status = status;
    // project.beneficiary_address = ctx.accounts.beneficiary.key();
    Ok(())
}
