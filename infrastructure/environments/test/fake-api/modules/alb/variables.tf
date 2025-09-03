variable "name" {
  description = "The name for the Application Load Balancer."
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where the ALB will be placed."
  type        = string
}

variable "public_subnet_ids" {
  description = "A list of public subnet IDs for the ALB."
  type        = list(string)
}
