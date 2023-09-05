import React from 'react'
import colors from '~/shared/theme/colors'
import { Box, Chip, Typography } from '@mui/material'
import { IconDelete } from '~/constants/icons'
import makeStyles from '@mui/styles/makeStyles'
import { CategoryType, SubCategoryType } from '~/models/categories'

const useStyles = makeStyles(() => ({
  selectedCategories: {
    padding: '10px',
    border: `1px solid ${colors.text.light}`,
    borderRadius: '20px',
    '& .MuiTypography-root': {
      padding: '0px 10px 10px 10px',
    },
  },
}))

interface IProps {
  category: CategoryType
  handleRemove?: (cat: CategoryType, subCat: SubCategoryType) => void
}

const ChipsCategories = ({ category, handleRemove }: IProps) => {
  const classes = useStyles()

  return (
    <Box className={classes.selectedCategories}>
      <Typography variant="body2" color="primary" fontWeight={600}>
        {category?.name}
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} maxWidth={350}>
        {category?.subCategories?.map((subCat, indexSubCat) => (
          <Chip
            key={`chip-subCategories-${indexSubCat}`}
            label={subCat?.name}
            variant="outlined"
            onDelete={handleRemove ? () => handleRemove(category, subCat) : null}
            deleteIcon={<Box display="flex" alignItems="center"><IconDelete /></Box>}
          />
        ))}
      </Box>
    </Box>
  )
}

ChipsCategories.defaultProps = {
  handleRemove: null,
}

export default ChipsCategories
