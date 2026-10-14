---
title: The sandbox contains. Who decides?
description: Open-source agent sandboxes such as OpenShell make containment much stronger. Containment answers what an AI/SI agent can do. Oversight still has to answer what it should do, who approved the rule, and how you prove it.
pubDate: 2026-10-15
tags: [runtime monitoring, OpenShell, agent sandboxes, oversight]
heroImage: /images/blog/the-sandbox-contains-who-decides/hero.svg
heroAlt: Three layers working together. The sandbox contains what an agent can reach. The watchdog watches it from outside the host. TAROS monitors each action, decides, and proves it.
keyPoints:
  - Agent sandboxes and out-of-band watchdogs make enforcement far stronger. Oversight tools shouldn’t try to rebuild them.
  - A sandbox controls resources such as hosts, paths and system calls. It doesn’t know what “raise speed in zone B while people are present” means.
  - TAROS monitors each action, returns one verdict, and records which policy version decided it and who approved that policy. The runtime enforces the verdict.
draft: false
---

AI/SI (Artificial Intelligence or Super Intelligence) agents are getting a new kind of home. Open-source agent sandboxes, with OpenShell the most prominent so far, run each agent inside a kernel-level boundary. The sandbox decides which files the agent can touch, which programs it can start, which endpoints it can reach and which credentials it can use. Out-of-band hardware watchdogs are being added beneath it. They watch the agent from a trust domain the agent can’t reach, and can quarantine it in milliseconds.

That is real progress, and it changes what runtime oversight has to do. This post looks at what that change means, what it makes possible, and how the pieces fit together.

## What an agent sandbox does

OpenShell is a good example. It restricts files and system calls at the kernel level, controls which programs reach which endpoints, keeps real credentials away from the agent, and checks its policies with a prover. When an agent wants more access, it can propose a change, which a human reviews by default.

Every one of those controls is about **resources**: processes, paths, hosts, credentials. That is exactly what a sandbox should control.

## What changes for runtime oversight

### Enforcement is becoming infrastructure

A kernel sandbox and a hardware watchdog will enforce boundaries far more strongly than software checks inside an application. Oversight tools shouldn’t try to rebuild them. The useful question is what still needs answering once they are in place.

### A verdict only counts if it is obeyed

An oversight decision is a safety control only if the system that can take the dangerous action has to obey it. If the agent can ask for a decision and then ignore the answer, the decision is advice. Sandboxes help with this, because they put a point between the agent and the outside world that the agent can’t get around.

<p class="pull-quote">The sandbox answers whether an agent <em>can</em> do something. Someone still has to decide whether it <em>should</em>.</p>

### Containment isn’t conformity

A sandbox log shows which process reached which endpoint. An assessor, an auditor or your own risk function asks different questions. Which safety rule was in force? Who wrote it, and who independently approved it? Which version made this decision? Is there a safety argument that ties those rules to the hazards you identified?

Sandboxes don’t answer those, and they aren’t meant to. Some gaps are very concrete. In OpenShell’s current release, the history of approved policy changes records *what* was approved and when, but not *who* approved it.

### Resources are not meaning

The sandbox knows that a fleet agent may call the robot command API on a given port. It doesn’t know what “raise the speed limit in zone B” means, that people are working in zone B right now, or that your site’s risk appetite rules it out. Those are questions about the domain, not the operating system.

<figure class="figure">
  <img src="/images/blog/the-sandbox-contains-who-decides/can-vs-should.svg" alt="Who answers which question in a robot fleet. The sandbox answers: may the agent reach the robot command API, and may it use the fleet credential. The watchdog answers: has the agent left its boundary, so quarantine it now. TAROS answers: should raise speed in zone B go ahead with people present, who approved the rule and in which line of defence, and which policy version decided." width="600" height="660" loading="lazy">
  <figcaption>Can versus should. Each layer answers a different question about the same agent.</figcaption>
</figure>

## What becomes possible

Sandboxes are being built to be extended. OpenShell publishes two hooks that matter here:

- **A control-plane hook** that lets an external governance service allow or deny changes to the sandbox’s own policy, including approvals of agent-proposed changes. It receives the caller’s identity and roles, and it can be set to **fail closed**: if the governance service can’t be reached, the change doesn’t happen.
- **A request-level hook** that lets an external service inspect, change or deny each HTTP or WebSocket request an agent makes, before credentials are added.

Put together, those hooks let an oversight layer do two things it couldn’t do before. It can make sure that **no policy change goes live without the right approvals**. And it can make sure that **an agent’s action waits for a verdict and has to obey it**. That turns a verdict from advice into a control.

## The solution: a closed loop

The sandbox contains. The watchdog watches. TAROS monitors each action, decides, and proves it.

<figure class="figure">
  <img src="/images/blog/the-sandbox-contains-who-decides/closed-loop.svg" alt="The closed loop. Safety rules and approvals across three lines of defence become a signed, versioned policy that moves through draft, shadow and active. Each runtime event is monitored by TAROS, which returns one verdict: allow, escalate, deny or freeze, naming the policy version and hash that decided. The enforcement point, such as a sandbox hook, a fleet controller or a release pipeline, applies the verdict and reports back. The decision and acknowledgement become evidence that feeds a safety case." width="600" height="900" loading="lazy">
  <figcaption>The closed loop: from approved rule, to verdict, to enforcement, to evidence.</figcaption>
</figure>

1. **Rules are approved, not just written.** Policies are written in domain terms and move from draft, to shadow (evaluated on live traffic without acting), to active. They become active only by promotion, with approvals from separate lines of defence, and each version is signed.
2. **Every action is monitored.** The runtime reports what the agent or machine is about to do, and TAROS checks it against the active policies.
3. **Every decision has one verdict.** Allow, escalate (hold for a human), deny or freeze. When several policies match, the most restrictive verdict wins.
4. **The runtime enforces it.** A sandbox hook, a fleet controller or a release pipeline applies the verdict. TAROS doesn’t reach inside the machine.
5. **The runtime reports back.** The enforcing system acknowledges the verdict it applied, and TAROS flags any report that doesn’t honour the decision.
6. **Everything becomes evidence.** Each decision records the policy version and hash that made it, alongside the acknowledgement, in tamper-evident records. That evidence feeds a safety case an assessor can review.

None of this replaces your certified safety function. E-stops and safety controllers still act in milliseconds, below everything described here.

## What this means if you run a robot fleet

If your fleet’s AI/SI agents run in a sandbox, you have a much stronger answer to “what *can* they do?” You still need answers to “what *should* they do?”, “who said so?” and “can you show me?”

A practical split:

- **Contain** with the sandbox: processes, files, network and credentials.
- **Watch** with an out-of-band watchdog, where you have one: quarantine an agent that leaves its boundary.
- **Decide and keep the record** with an oversight layer: domain-level verdicts, separation of duties, evidence of which policy decided, and a safety case.

## Where TAROS fits

TAROS, the Trusted Autonomous Runtime Oversight System, monitors every autonomous system you connect while it runs. Today it provides:

- one verdict per decision: allow, escalate, deny or freeze;
- policies in domain terms, promoted from draft to shadow to active with separation of duties across three lines of defence;
- evidence that names the policy version and hash behind each decision;
- an interface for the enforcing runtime to acknowledge the verdict it applied;
- safety case export.

TAROS is independent. It uses the published extension points of open-source sandboxes, and no sandbox vendor has reviewed or endorsed it. [See how the platform works](/platform.html).

If you need to show what your systems were allowed to do, who approved it and why, [let’s talk](/contact.html).
