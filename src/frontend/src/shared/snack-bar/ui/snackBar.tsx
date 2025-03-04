import { observer } from 'mobx-react-lite';
import { SnackBar } from '@consta/uikit/SnackBar';

import "./styles/snack-bar.css";
import { snackBarStore } from '../stores/snackBarStore';

export const SnackBarWrapper = observer(() => {

  return (
    <div className="snack-bar-wrapper">
      <SnackBar
        items={snackBarStore.items}
        onItemClose={(item) => snackBarStore.removeItem(item.key)}
        getItemAutoClose={() => 5}
      />
    </div>
  );
});
