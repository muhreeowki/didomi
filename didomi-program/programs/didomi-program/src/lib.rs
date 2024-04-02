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
        title: [u8; 64],
        description: [u8; 256],
        organizer_name: [u8; 24],
        target_amount: u64,
    ) -> Result<()> {
        instructions::create_project_handler(
            ctx,
            title,
            description,
            organizer_name,
            target_amount,
        )?;
        Ok(())
    }

    // Update project instruction
    pub fn update_project_handler(
        ctx: Context<UpdateProject>,
        title: [u8; 64],
        description: [u8; 256],
        organizer_name: [u8; 24],
        target_amount: u64,
    ) -> Result<()> {
        instructions::update_project_handler(
            ctx,
            title,
            description,
            organizer_name,
            target_amount,
        )?;
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
        amount: u64,
        message: [u8; 128],
        token_type: u8,
    ) -> Result<()> {
        instructions::create_contribution_handler(ctx, amount, message, token_type)?;
        Ok(())
    }
}
