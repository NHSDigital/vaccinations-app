provider "aws" {
  alias = "server_function"
  default_tags {
    tags = var.default_tags
  }
}

provider "aws" {
  alias = "iam"
  default_tags {
    tags = var.default_tags
  }
}

provider "aws" {
  alias = "dns"
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
