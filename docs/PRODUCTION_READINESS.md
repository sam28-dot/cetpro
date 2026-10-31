# Production Readiness Checklist

This checklist records actions that require live-service access or owner decisions. A code change or successful build alone does not prove production readiness.

## Before enabling a public launch

- [ ] Confirm the canonical production domain. The current metadata uses `https://cetpro-predictor.vercel.app/`; replace it if the custom domain is verified and intended to be canonical.
- [ ] In Vercel, confirm `REACT_APP_API_URL=https://cetpro-0kjj.onrender.com/api` for the production deployment, then redeploy only after review.
- [ ] In Render, confirm `FRONTEND_URL` exactly matches the chosen frontend origin and that all required secrets are configured in the dashboard (never commit secrets).
- [ ] Verify the live `/api/health` response returns HTTP 200 and reports the database as connected.
- [ ] Run a production smoke test: landing page, cutoff search/filter, college details, sign-up, login, profile, prediction save/list/delete, share flow, forgot-password OTP, reset-password, and logout/session expiry.
- [ ] Verify authorization boundaries: one account cannot read, modify, or delete another account's records; shared results expose only intended fields.
- [ ] Review JWT lifecycle, refresh-token expiry/revocation/rotation, password-reset single-use and expiry, OTP attempt limits, and logout semantics. The current browser token storage uses localStorage; evaluate an HttpOnly-cookie design before making a security claim.
- [ ] Run dependency/security scans for frontend and backend lockfiles; resolve or explicitly accept findings with documented rationale.
- [ ] Test backup and restore of MongoDB data. Confirm retention, access restrictions, and recovery procedure.
- [ ] Confirm HTTPS and redirect behavior on the canonical domain, mobile layout, keyboard navigation, and accessible form errors.
- [ ] Publish and review privacy policy, terms/disclaimer, contact/support path, and data-retention explanation before collecting real user accounts.
- [ ] Confirm official cutoff dataset provenance, academic year, round, categories, and record counts; state clearly that current functionality is historical comparison, not validated ML prediction.
- [ ] Check Vercel and Render deployment logs for startup errors and browser console/network errors.
- [ ] Confirm rollback steps and the last known-good deployment before promoting a release.

## After launch

- [ ] Check error logs and health status daily for the first week.
- [ ] Monitor latency, 4xx/5xx rates, email delivery, database connection failures, and hosting usage.
- [ ] Test account recovery and report-a-problem/contact channels with a non-owner account.
- [ ] Keep a dated record of releases, incidents, dataset updates, and manual validation.
- [ ] Recheck official admission sources before adding a new admission year or round.

## Important limitations

- The checklist must be completed against the live deployment. Repository inspection cannot verify Vercel/Render environment variables, DNS, SMTP delivery, database backup status, live HTTP behavior, or Search Console ownership.
- Do not mark an item complete based only on source code being present.
- No live deployment or external service configuration is performed by this checklist.
