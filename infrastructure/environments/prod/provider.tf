terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "vaccinations-app-tfstate-prod"
    key    = "terraform.tfstate"
    region = "eu-west-2"

    use_lockfile = true
    encrypt      = true
  }
}

provider "aws" {
  region = local.region
  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  alias  = "global"
  region = "us-east-1"
  default_tags {
    tags = local.default_tags
  }
}
