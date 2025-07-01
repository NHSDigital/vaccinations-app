terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  alias = "server_function"
  region = var.region
  default_tags {
    tags = var.default_tags
  }
}

provider "aws" {
  alias = "iam"
  region = var.region
  default_tags {
    tags = var.default_tags
  }
}

provider "aws" {
  alias = "dns"
  region = var.region
  default_tags {
    tags = var.default_tags
  }
}

provider "aws" {
  alias  = "global"
  region = "us-east-1"
  default_tags {
    tags = var.default_tags
  }
}
