import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Switch,
  IconButton,
  type Theme
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { type ProductType, type StatusProductType } from '~/models/products'
import useUtils from '~/shared/hooks/useUtils'

const useStyles = makeStyles((theme: Theme) => ({
  actions: {
    justifyContent: 'space-between'
  },
  card: {
    transition: `all 0.3s ${theme.transitions.easing.easeInOut}`,
    '&:hover': {
      opacity: '0.9'
    }
  }
}))

interface IProps {
  index: number
  product: ProductType
  handleEdit: (id: string) => void
  handleUpdateStatus: (index: number, id: string, status: StatusProductType) => void
  handleOpenMenu: (event: React.MouseEvent<HTMLButtonElement>, product: ProductType) => void
}

const CardProduct = ({ index, product, handleEdit, handleUpdateStatus, handleOpenMenu }: IProps): React.JSX.Element => {
  const styles = useStyles()

  const { formatCurrencyString } = useUtils()

  return (
    <Card>
      <CardMedia
        className={styles.card}
        sx={{ height: 200, cursor: 'pointer' }}
        image={`images/${product.images[0].fileName}`}
        title={product.title}
        onClick={() => { handleEdit(product.id) }}
      />

      <CardContent>
        <Typography gutterBottom variant="body1">
          {product.title}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.quaternary">
          {product.subtitle}
        </Typography>
        <Typography variant="subtitle2" color="text.quaternary">
          {formatCurrencyString(product.value)} / {formatCurrencyString(product.valueUnique)}
        </Typography>
      </CardContent>

      <CardActions className={styles.actions}>
        <Box display="flex" gap={2}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="body2" color="text.primary">
              Ativo
            </Typography>

            <Switch
              size="small"
              checked={product?.status?.isActive ?? false}
              onChange={(_, checked: boolean) => { handleUpdateStatus(index, product.id, { isActive: checked }) }}
            />
          </Box>

          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="body2" color="text.primary">
              Destaque
            </Typography>

            <Switch
              size="small"
              checked={product?.status?.isHighlighted ?? false}
              onChange={(_, checked: boolean) => { handleUpdateStatus(index, product.id, { isHighlighted: checked }) }}
            />
          </Box>
        </Box>

        <Box>
          <IconButton onClick={(event) => { handleOpenMenu(event, product) }}>
            <MoreVertIcon color="primary" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  )
}

export default CardProduct
