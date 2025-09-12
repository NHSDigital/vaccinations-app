variable "project_name" {
  description = "The overall project name."
  type        = string
  default     = "fake-api-project"
}

variable "region" {
  description = "The AWS region to deploy all resources."
  type        = string
  default     = "eu-west-2"
}

variable "availability_zones" {
  description = "A list of availability zones to use."
  type        = list(string)
  default     = ["eu-west-2a", "eu-west-2b"]
}

variable "app_root_url" {
  description = "URL of the application"
  type        = string
  default     = "https://test.vaccinations.nhs.uk"
}
