# JOY TRUE PROFILE — Testing & Quality Assurance Plan

## 1. Test Strategy Matrix

`
+-------------------------------------------------------------------------------+
|                             TEST PYRAMID                                      |
|                                                                               |
|                     / \     End-to-End Workflow Tests                         |
|                    /   \    (Company -> HR -> Candidate -> Verify)           |
|                   /-----\                                                     |
|                  /       \   API & Role Permission Integration Tests          |
|                 /         \  (RBAC, IDOR, PostgreSQL Transactions)            |
|                /-----------\                                                  |
|               /             \ Unit Tests (Schemas, Helpers, Masking)          |
+-------------------------------------------------------------------------------+
`

## 2. Automated Test Suite Execution
Run the complete Python backend test suite:
`powershell
python -m pytest backend/tests/test_platform_workflows.py -v
`

## 3. Manual Test Walkthrough Checklist
- [x] **SuperAdmin**: Login, view telemetry charts, edit company custom tariff, toggle API provider.
- [x] **Company**: View labor headcount, invite HR executive, inspect CLRA Form XVI audit log.
- [x] **HR Executive**: Import candidates via Excel, dispatch magic links via WhatsApp, view real-time status change.
- [x] **Candidate**: Open magic link, enter 4-digit PIN, submit Aadhaar & PAN verification, view verified gate pass badge.
- [x] **Mobile Responsiveness**: Test on 320px, 375px, 390px, 768px, and 1440px with 0 horizontal scroll.
