# Board Archive

<!-- Completed and archived cards, newest first. Full card blocks preserved from board.md with completed/archived date added. -->

### Remove "looking for SWE opportunities" footer line

- **status**: done
- **completed**: 2026-05-21
- **size**: S
- **priority**: 2
- **notes**: One-line removal in `src/components/Footer.tsx:29`. Off-tone for the north-star "calm, technically mature" positioning.

### Kill "Play my Card Game!" CTA + dead Cards with Friends links

- **status**: done
- **completed**: 2026-05-21
- **size**: S
- **priority**: 1
- **notes**: Cards with Friends is offline. Remove the Home button at `src/views/Home.tsx:42-46` and unwrap the dead anchors in `src/views/Portfolio.tsx:21,29` that link to cardswithfriendsgame.com.
