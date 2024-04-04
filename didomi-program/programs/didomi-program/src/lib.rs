mod instructions;
pub mod state;
use self::instructions::*;
use self::state::*;

use anchor_lang::prelude::*;

declare_id!("4f8xSv3wUdYUe2z343s4M2WRH7Hy2zr7Mdmpi31Y59bY");

#[program]
pub mod didomi_program {
    use super::*;
    // Create project instruction
    pub fn create_project(
        ctx: Context<CreateProject>,
        id: u64,
        name: [u8; 32],
        start_date: i64,
        end_date: i64,
        target_amount: u64,
        status: u8,
    ) -> Result<()> {
        create_project_handler(ctx, id, name, start_date, end_date, target_amount, status)?;
        Ok(())
    }

    // Update project instruction
    pub fn update_project(
        ctx: Context<UpdateProject>,
        id: u64,
        name: [u8; 32],
        start_date: i64,
        end_date: i64,
        target_amount: u64,
        status: u8,
    ) -> Result<()> {
        update_project_handler(ctx, id, name, start_date, end_date, target_amount, status)?;
        Ok(())
    }

    // Delete project instruction
    pub fn delete_project(ctx: Context<DeleteProject>) -> Result<()> {
        instructions::delete_project_handler(ctx)?;
        Ok(())
    }

    // Contribution instruction
    pub fn create_contribution(
        ctx: Context<CreateContribution>,
        id: u64,
        amount: u64,
        token_type: u8,
    ) -> Result<()> {
        create_contribution_handler(ctx, id, amount, token_type)?;
        Ok(())
    }
}
