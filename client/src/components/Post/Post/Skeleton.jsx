import React from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import styles from "./Post.module.scss";

export const PostSkeleton = () => {
  return (
    <div>
      <Stack className={styles.progress} sx={{ color: 'grey.500' }} spacing={2} direction="row">
        <CircularProgress color="primary" />
      </Stack>
    </div>
  );
};
