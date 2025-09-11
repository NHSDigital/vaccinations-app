# Use the official Keycloak image as a base
FROM quay.io/keycloak/keycloak:24.0.4 as builder

# Set environment variables for production-like optimization
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=dev-file

# Run the build command to optimize Keycloak
RUN /opt/keycloak/bin/kc.sh build

# Final, optimized image
FROM quay.io/keycloak/keycloak:24.0.4

# Copy the optimized build from the builder stage
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy realm configuration files. Keycloak will import these on first start.
COPY *realm.json /opt/keycloak/data/import/

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
