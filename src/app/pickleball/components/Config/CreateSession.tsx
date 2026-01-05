import { useFormContext, useWatch } from 'react-hook-form';
import { GameConfig } from '../../types';
import Button from '@/ds/Button/Button';

export default function CreateSession() {
  const { control } = useFormContext<GameConfig>();
  const sessionPlayers = useWatch({ control, name: 'sessionPlayers' });
  const isDisabled = sessionPlayers.length === 0;

  return (
    <Button full type="submit" disabled={isDisabled}>
      Start New Session
    </Button>
  );
}
