locals {
  region                       = "eu-west-2"
  project_identifier           = "vaccinations-app"
  project_identifier_shortcode = "vita"
  environment                  = "dev"
  default_tags = {
    ManagedBy   = "Terraform"
    Project     = local.project_identifier
    Environment = local.environment
  }
}
