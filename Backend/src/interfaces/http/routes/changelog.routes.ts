import { Router } from 'express';
import { ChangelogRepository } from '../../../infrastructure/persistence/repositories/changelog.repository';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import { ListChangelogUseCase } from '../../../application/use-cases/changelog/list-changelog.usecase';
import { ChangelogController } from '../controllers/changelog.controller';

const router = Router({ mergeParams: true });

const changelogRepo = new ChangelogRepository();
const listChangelog = new ListChangelogUseCase(changelogRepo);
const controller = new ChangelogController(listChangelog);

const jwtService = new JwtService();

router.get('/', authMiddleware(jwtService), controller.list);

export default router;
