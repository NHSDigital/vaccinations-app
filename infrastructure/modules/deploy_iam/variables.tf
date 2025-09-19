variable "account_id" {
  type        = string
  description = "AWS Account Id"
}

variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
}

variable "region" {
  type        = string
  description = "The AWS region to deploy to"
}

variable "environment" {
  type        = string
  description = "Environment to deploy resources into"
}

variable "project_shortcode" {
  type        = string
  description = "Project shortcode identifier"
}

variable "is_local" {
  type        = bool
  description = "Useful for turning off certain parts of monitoring for local development"
}
