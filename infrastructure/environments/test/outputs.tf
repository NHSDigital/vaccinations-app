output "cloudfront_url" {
  value       = module.deploy.cloudfront_url
  description = "The URL for the cloudfront distribution"
}

output "application_url" {
  description = "The public URL of the fake-api application."
  value       = module.deploy_fake_api.application_url
}

output "fake_api_ecr_repository_url" {
  description = "The ECR repository URL for the fake-api service."
  value       = module.deploy_fake_api.fake_api_ecr_repository_url
}
