terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.92.0"
    }
  }

  backend "s3" {
    bucket = "vaccinations-app-tfstate"
    key    = "terraform.tfstate"
    region = "eu-west-2"

    use_lockfile = true
    encrypt      = true
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      ManagedBy   = "Terraform"
      Project     = var.project_identifier
      Environment = var.environment
    }
  }
}
