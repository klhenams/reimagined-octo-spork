package services

import (
	"github.com/gsk-fyp/rms-gateway/core/models"
	"github.com/gsk-fyp/rms-gateway/internal/config"
)

func Setup() []models.Service {
	return []models.Service{
		{
			Name:    "management",
			BaseURL: config.NewConfig().MANAGEMENT,
			Routes: []models.Route{
				// Tenants
				{Method: "GET", ServicePath: "/tenants", TargetPath: "/tenants"},
				{Method: "POST", ServicePath: "/tenants", TargetPath: "/tenants"},
				{Method: "POST", ServicePath: "/tenants/create-all", TargetPath: "/tenants/create-all"},
				{Method: "PATCH", ServicePath: "/tenants/:tenant_id", TargetPath: "/tenants/:tenant_id"},
				{Method: "DELETE", ServicePath: "/tenants/:tenant_id", TargetPath: "/tenants/:tenant_id"},

				{Method: "POST", ServicePath: "/mmdas", TargetPath: "/mmdas"},

				// Geometry
				{Method: "GET", ServicePath: "/geometry/:tenant_name/businesses", TargetPath: "/geometry/tenant_name/businesses"},
				{Method: "GET", ServicePath: "/geometry/:tenant_name/buildings", TargetPath: "/geometry/:tenant_name/buildings"},
				{Method: "GET", ServicePath: "/geometry/:tenant_name/mmdas", TargetPath: "/geometry/:tenant_name/mmdas"},

				// Super Admins
				{Method: "GET", ServicePath: "/super-admins", TargetPath: "/super-admins/"},
				{Method: "POST", ServicePath: "/super-admins", TargetPath: "/super-admins/"},
				{Method: "POST", ServicePath: "/super-admins/authenticate", TargetPath: "/super-admins/authenticate"},
				{Method: "GET", ServicePath: "/super-admins/current", TargetPath: "/super-admins/current"},
				{Method: "PATCH", ServicePath: "/super-admins/current", TargetPath: "/super-admins/current"},
				{Method: "GET", ServicePath: "/super-admins/:super_admin_id", TargetPath: "/super-admins/:super_admin_id"},

				// Users
				{Method: "GET", ServicePath: "/users", TargetPath: "/users/"},
				{Method: "POST", ServicePath: "/users", TargetPath: "/users/"},
				{Method: "GET", ServicePath: "/users/:user_id", TargetPath: "/users/:user_id"},

				// Buildings
				{Method: "GET", ServicePath: "/buildings", TargetPath: "/buildings"},
				{Method: "POST", ServicePath: "/buildings", TargetPath: "/buildings"},
				{Method: "GET", ServicePath: "/buildings/:building_id", TargetPath: "/buildings/:building_id"},
				{Method: "PATCH", ServicePath: "/buildings/:building_id", TargetPath: "/buildings/:building_id"},
				{Method: "GET", ServicePath: "/buildings/:building_id/businesses", TargetPath: "/buildings/:building_id/businesses"},

				// Businesses
				{Method: "GET", ServicePath: "/businesses", TargetPath: "/businesses"},
				{Method: "POST", ServicePath: "/businesses", TargetPath: "/businesses"},
				{Method: "GET", ServicePath: "/businesses/:business_id", TargetPath: "/businesses/:business_id"},
				{Method: "PATCH", ServicePath: "/businesses/:business_id", TargetPath: "/businesses/:business_id"},
				{Method: "GET", ServicePath: "/businesses/data/:tenant_name", TargetPath: "/businesses/data/:tenant_name"},

				// Root
				{Method: "GET", ServicePath: "/", TargetPath: "/"},
			},
		},
		{
			Name:    "pay",
			BaseURL: config.NewConfig().PAYMENT, // You'll need to add this to your config
			Routes: []models.Route{
				// Users
				{Method: "POST", ServicePath: "/users", TargetPath: "/users"},
				{Method: "GET", ServicePath: "/users/:id", TargetPath: "/users/:id"},
				{Method: "PUT", ServicePath: "/users/:id", TargetPath: "/users/:id"},

				// Bills
				{Method: "POST", ServicePath: "/bills", TargetPath: "/bills"},
				{Method: "GET", ServicePath: "/bills/:id", TargetPath: "/bills/:id"},
				{Method: "GET", ServicePath: "/bills", TargetPath: "/bills"},
				{Method: "PUT", ServicePath: "/bills/:id", TargetPath: "/bills/:id"},
				{Method: "DELETE", ServicePath: "/bills/:id", TargetPath: "/bills/:id"},
				{Method: "POST", ServicePath: "/bills/:id/send", TargetPath: "/bills/:id/send"},

				// Payments
				{Method: "POST", ServicePath: "/payments", TargetPath: "/payments"},
				{Method: "GET", ServicePath: "/payments/:id", TargetPath: "/payments/:id"},
				{Method: "GET", ServicePath: "/payments", TargetPath: "/payments"},
				{Method: "GET", ServicePath: "/payments/verify", TargetPath: "/payments/verify"},

				// Webhook
				{Method: "POST", ServicePath: "/webhook", TargetPath: "/webhook"},
			},
		},
		{
			Name:    "files",
			BaseURL: config.NewConfig().FILE,
			Routes: []models.Route{
				{Method: "POST", ServicePath: "/upload", TargetPath: "/upload"},
				{Method: "GET", ServicePath: "/download/:shortLink", TargetPath: "/download/:shortLink"},
			},
		},
	}
}
