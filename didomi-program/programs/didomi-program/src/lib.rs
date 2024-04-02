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
    pub fn create_project(ctx: Context<CreateProject>, data: ProjectData) -> Result<()> {
        instructions::create_project_handler(ctx, data)?;
        Ok(())
    }

    // Update project instruction
    pub fn update_project(ctx: Context<UpdateProject>, data: ProjectData) -> Result<()> {
        instructions::update_project_handler(ctx, data)?;
        Ok(())
    }

    // Delete project instruction
    pub fn delete_project(ctx: Context<DeleteProject>) -> Result<()> {
        instructions::delete_project_handler(ctx)?;
        Ok(())
    }
}
