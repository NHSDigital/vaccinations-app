variable "region" {
  type        = string
  description = "The AWS region, e.g. eu-west-2"
}

variable "project_identifier" {
  type        = string
  description = "The project identifier, typically the repository name"
}

variable "project_identifier_shortcode" {
  type        = string
  description = "The project identifier shortcode to be used a prefixes/suffixes"
}

variable environment {
  type        = string
  description = "The AWS environment (account) to deploy to, e.g. dev/test/preprod/prod"
}
