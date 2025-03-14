import { Repository } from 'typeorm'
import { OrdersMiddleware } from './orders.middleware'
import { OrderDetail, Orders, SkincareProduct } from 'src/typeorm/entities'

describe('OrdersMiddleware', () => {
  let orderRepository: Repository<Orders>
  let orderDetailRepository: Repository<OrderDetail>
  let skincareProductRepository: Repository<SkincareProduct>

  beforeEach(() => {
    orderRepository = {} as Repository<Orders>
    orderDetailRepository = {} as Repository<OrderDetail>
    skincareProductRepository = {} as Repository<SkincareProduct>
  })

  it('should be defined', () => {
    const middleware = new OrdersMiddleware(orderRepository, orderDetailRepository, skincareProductRepository)
    expect(middleware).toBeDefined()
  })
})
