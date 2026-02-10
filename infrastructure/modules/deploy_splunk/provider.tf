provider "aws" {
  alias  = "global"
  region = "us-east-1"
  default_tags {
    tags = var.default_tags
  }
}
