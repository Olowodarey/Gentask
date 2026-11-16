# Testing Guide for ReviewBatch Contract

## Quick Start

Run all tests:
```bash
cd contracts
python3 -m pytest tests/test_review_batch.py -v
```

## Test Coverage

The test suite covers **24 test cases** across 6 major areas:

### 1. Contract Initialization (6 tests)
- ✅ Valid initialization with all parameters
- ✅ Invalid repo format validation
- ✅ Invalid template rejection
- ✅ Invalid payout mode rejection
- ✅ Zero/negative reward pool rejection
- ✅ Empty criteria validation

### 2. PR Management (4 tests)
- ✅ PR URL parsing logic
- ✅ Invalid PR URL rejection
- ✅ Maximum 15 PR limit enforcement
- ✅ Duplicate PR detection

### 3. Gates Validation (2 tests)
- ✅ All gates passing scenario
- ✅ Individual gate failure scenarios (6 gates tested)

### 4. Ranking Validation (3 tests)
- ✅ Valid ranking JSON structure
- ✅ Invalid ranking scenarios (5 edge cases)
- ✅ Score-based sorting and rank assignment

### 5. Payout Calculation (4 tests)
- ✅ Winner-takes-all mode
- ✅ Top-3-split with 3+ PRs
- ✅ Top-3-split with 2 PRs
- ✅ Rounding remainder handling

### 6. Workflow States (4 tests)
- ✅ Initial contract state
- ✅ Lock transition
- ✅ Empty batch lock prevention
- ✅ Judging state transitions

### 7. Contract Structure (1 test)
- ✅ Expected methods and interface

## Running Specific Tests

Run a specific test class:
```bash
python3 -m pytest tests/test_review_batch.py::TestContractInitialization -v
```

Run a specific test:
```bash
python3 -m pytest tests/test_review_batch.py::TestPayoutCalculation::test_winner_takes_all -v
```

## Test Options

Verbose output:
```bash
python3 -m pytest tests/test_review_batch.py -v
```

Show print statements:
```bash
python3 -m pytest tests/test_review_batch.py -v -s
```

Stop at first failure:
```bash
python3 -m pytest tests/test_review_batch.py -x
```

Run with short traceback:
```bash
python3 -m pytest tests/test_review_batch.py -v --tb=short
```

## Test Results Summary

```
============================= test session starts ==============================
platform linux -- Python 3.12.3, pytest-9.1.1
collected 24 items

tests/test_review_batch.py::TestContractInitialization::test_valid_initialization PASSED
tests/test_review_batch.py::TestContractInitialization::test_invalid_repo_format PASSED
tests/test_review_batch.py::TestContractInitialization::test_invalid_template PASSED
tests/test_review_batch.py::TestContractInitialization::test_invalid_payout_mode PASSED
tests/test_review_batch.py::TestContractInitialization::test_zero_reward_pool PASSED
tests/test_review_batch.py::TestContractInitialization::test_empty_criteria PASSED
tests/test_review_batch.py::TestPRManagement::test_pr_url_parsing PASSED
tests/test_review_batch.py::TestPRManagement::test_invalid_pr_url PASSED
tests/test_review_batch.py::TestPRManagement::test_max_pr_limit PASSED
tests/test_review_batch.py::TestPRManagement::test_duplicate_pr_detection PASSED
tests/test_review_batch.py::TestGatesValidation::test_all_gates_pass PASSED
tests/test_review_batch.py::TestGatesValidation::test_gates_fail_scenarios PASSED
tests/test_review_batch.py::TestRankingValidation::test_valid_ranking PASSED
tests/test_review_batch.py::TestRankingValidation::test_invalid_ranking_scenarios PASSED
tests/test_review_batch.py::TestRankingValidation::test_ranking_sort_order PASSED
tests/test_review_batch.py::TestPayoutCalculation::test_winner_takes_all PASSED
tests/test_review_batch.py::TestPayoutCalculation::test_top_3_split_full PASSED
tests/test_review_batch.py::TestPayoutCalculation::test_top_3_split_two_prs PASSED
tests/test_review_batch.py::TestPayoutCalculation::test_payout_rounding PASSED
tests/test_review_batch.py::TestWorkflowStates::test_initial_state PASSED
tests/test_review_batch.py::TestWorkflowStates::test_lock_transition PASSED
tests/test_review_batch.py::TestWorkflowStates::test_cannot_lock_empty_batch PASSED
tests/test_review_batch.py::TestWorkflowStates::test_judging_state_transitions PASSED
tests/test_review_batch.py::test_contract_structure PASSED

============================== 24 passed in 0.08s ==============================
```

## Notes

- These tests validate the contract logic without requiring GenLayer CLI
- For full consensus testing with validators, install GenLayer CLI and run:
  ```bash
  genlayer test tests/ --integration
  ```
- Tests are organized by functional area for easy navigation
- All validation rules from the contract are tested
- Edge cases and error conditions are covered

## Next Steps

1. **Install GenLayer CLI** (when available) for integration testing
2. **Add integration tests** that deploy to a test network
3. **Test with real GitHub API** responses
4. **Test validator consensus** behavior
5. **Add performance benchmarks**

## Dependencies

- Python 3.12+
- pytest 9.1.1+

No additional dependencies required for unit tests.
