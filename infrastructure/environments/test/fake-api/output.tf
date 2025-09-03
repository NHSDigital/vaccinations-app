output "application_url" {
  description = "The public URL of the fake-api application."
  value       = "http://${module.alb.dns_name}"
}

output "fake_api_ecr_repository_url" {
  description = "The ECR repository URL for the fake-api service."
  value       = module.fake_api_service.ecr_repository_url
}
