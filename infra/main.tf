terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
  }
}

variable "vercel_api_token" {
  type      = string
  sensitive = true
}

provider "vercel" {
  api_token = var.vercel_api_token
}

# Backend project
resource "vercel_project" "backend" {
  name      = "rillet-interview-backend"
  framework = "other"

  git_repository = {
    type = "github"
    repo = "arihantchoudhary/rillet-coding-interview-fe-main"
  }

  root_directory = "rillet-backend"

  environment = [
    {
      key    = "NODE_ENV"
      value  = "production"
      target = ["production", "preview"]
    }
  ]
}

# Frontend project
resource "vercel_project" "frontend" {
  name      = "rillet-interview-frontend"
  framework = "vite"

  git_repository = {
    type = "github"
    repo = "arihantchoudhary/rillet-coding-interview-fe-main"
  }

  root_directory = "rillet-react"

  build_command    = "npm run build"
  output_directory = "dist"
}

# Deploy backend
resource "vercel_deployment" "backend" {
  project_id = vercel_project.backend.id
  ref        = "main"
  production = true
}

# Set frontend env var to point to backend URL after backend deploys
resource "vercel_project_environment_variable" "api_base" {
  project_id = vercel_project.frontend.id
  key        = "VITE_API_BASE"
  value      = "https://${vercel_deployment.backend.url}"
  target     = ["production", "preview"]
}

# Deploy frontend (depends on backend URL being set)
resource "vercel_deployment" "frontend" {
  project_id = vercel_project.frontend.id
  ref        = "main"
  production = true

  depends_on = [vercel_project_environment_variable.api_base]
}

output "backend_url" {
  value = "https://${vercel_deployment.backend.url}"
}

output "frontend_url" {
  value = "https://${vercel_deployment.frontend.url}"
}
