# Gentask GenLayer Contracts

This folder contains GenLayer intelligent contracts for the Gentask platform.

## Contracts

### ReviewBatch.py

Main contract for managing review batches with AI-validated judging.

**Key Features:**
- Max 15 PRs per batch
- Rubric locks on creation (immutable)
- Each PR pinned to commit SHA
- 5 hard gates filter PRs
- AI validators (5 nodes) judge with consensus
- Winner-takes-all OR top-3-split payout modes

## Using GenLayer Skills

### 1. Install GenLayer Skills Plugin

**For Zed:**
```bash
/plugin marketplace add genlayerlabs/skills
```

**For VS Code:**
```bash
codex plugin marketplace add genlayerlabs/skills
```

**For Cursor:**
```bash
/plugin install genlayer-dev
```

### 2. Development Workflow

**Write Contract:**
The plugin provides intelligent autocomplete for GenLayer contracts.

**Lint Contract:**
```bash
/plugin install genlayermode
```
Then use the GenVM Lint plugin to validate contracts for safety, correctness, and SDK compliance.

**Direct Tests:**
```bash
/plugin install genlayer-dev
```
Fast in-memory tests with `--json` output. No server required.

**Integration Tests:**
```bash
/plugin install genlayer-dev
```
Full consensus validation against real GenLayer environments.

### 3. CLI Operations

**GenLayer CLI:**
```bash
/plugin install genlayernode
```
Deploy, interact with, and debug contracts from the terminal.

**Validator Setup:**
```bash
# Interactive wizard from bare Linux to production-ready validator
```

## Contract API

### ReviewBatch

```python
# Initialize
batch = ReviewBatch(
    project_id="owner/repo",
    project_name="My Project",
    maintainer="0x...",
    rubric_template="bug-fix",
    rubric_criteria=["Root cause identified", "Tests added", ...],
    reward_pool=5000_000000,  # 5000 USDC (6 decimals)
    stablecoin="USDC",
    chain_id="base",
    deadline="2026-12-31T23:59:59Z",
    payout_mode="winner-takes-all"
)

# Add PRs (max 15)
batch.add_pr(
    pr_id="pr123",
    pr_number=123,
    title="Fix memory leak",
    author="contributor",
    head_sha="abc123def456",  # PINNED
    files_changed=3,
    additions=45,
    deletions=12,
    target_branch="main"
)

# Lock rubric and confirm escrow
batch.lock_and_escrow(tx_hash="0x...")

# Run gates on each PR
batch.run_gates(
    pr_id="pr123",
    ci_status="success",
    has_tests=True,
    diff_size=57,
    is_draft=False,
    targets_default=True
)

# AI validators judge (async, 5 nodes, consensus)
result = await batch.judge_prs()
# Returns: { winner_id, ranking: [{pr_id, rank, score, reason}] }

# Execute payout
batch.execute_payout(tx_hash="0x...")

# File appeal
batch.file_appeal(
    pr_id="pr456",
    contributor="0x...",
    reason="Validators missed critical fix"
)

# Get info
info = batch.get_batch_info()
```

## Testing

Create test files in `contracts/tests/`:

```python
# tests/test_review_batch.py
from ReviewBatch import ReviewBatch

def test_pr_limit():
    batch = ReviewBatch(...)
    
    # Add 15 PRs - should succeed
    for i in range(15):
        result = batch.add_pr(...)
        assert result["success"]
    
    # 16th PR should fail
    result = batch.add_pr(...)
    assert not result["success"]
    assert "Maximum 15 PRs" in result["error"]

def test_rubric_lock():
    batch = ReviewBatch(...)
    batch.add_pr(...)
    
    # Lock
    batch.lock_and_escrow(tx_hash="0x...")
    assert batch.rubric_locked
    
    # Try to add after lock
    result = batch.add_pr(...)
    assert not result["success"]
    assert "already locked" in result["error"]

async def test_judging():
    batch = ReviewBatch(...)
    batch.add_pr(...)
    batch.lock_and_escrow(tx_hash="0x...")
    batch.run_gates(pr_id="pr1", ci_status="success", ...)
    
    result = await batch.judge_prs()
    assert result["success"]
    assert result["result"]["winner_id"]
    assert len(result["result"]["ranking"]) > 0
```

Run tests:
```bash
# Direct tests (fast)
genlayer test tests/ --json

# Integration tests (full consensus)
genlayer test tests/ --integration
```

## Deployment

```bash
# Deploy to GenLayer testnet
genlayer deploy ReviewBatch.py --network testnet

# Deploy to mainnet
genlayer deploy ReviewBatch.py --network mainnet
```

## Integration with Frontend

The frontend (`/frontend`) uses service layer abstractions that will call these contracts via GenLayer RPC:

```typescript
// frontend/lib/services/batch-service.ts
async createBatch(params) {
  // Call ReviewBatch contract
  const contract = await genLayerClient.deploy("ReviewBatch", params);
  return contract.address;
}

async judgeBatch(batchId) {
  // Call judge_prs on contract
  const result = await genLayerClient.call(batchId, "judge_prs");
  return result;
}
```

## Resources

- [GenLayer Docs](https://docs.genlayer.com)
- [GenVM SDK Reference](https://docs.genlayer.com/genvm/sdk)
- [Validator Setup Guide](https://docs.genlayer.com/validators/setup)
- [Skills Plugin Docs](https://github.com/genlayerlabs/skills)

## Notes

- All AI validation uses the `@AgentEquivalencePrinciple` decorator for consensus
- Contracts are Python-based but run on GenVM (not CPython)
- Gas costs are deterministic despite AI usage
- Validators run identical prompts to reach consensus
- Results are cryptographically verifiable
