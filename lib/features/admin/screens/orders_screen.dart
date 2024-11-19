import 'package:amazon/common/widget/loader.dart';
import 'package:amazon/features/account/widgets/product.dart';
import 'package:amazon/features/admin/services/admin_services.dart';
import 'package:amazon/models/order.dart';
import 'package:flutter/material.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  List<Order>? orders;
  final AdminServices adminServices = AdminServices();

  @override
  void initState() {
    super.initState();
    fetchOrders();
  }

  Future<void> fetchOrders() async {
    orders = await adminServices.fetchAllOrders(context);
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return orders == null
        ? const Loader()
        : GridView.builder(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
            ),
            itemCount: orders?.length ?? 0,
            itemBuilder: (context, index) {
              final order = orders![index];
              return order.products.isNotEmpty &&
                      order.products[0].images.isNotEmpty
                  ? GestureDetector(
                      onTap: () {
                        Navigator.pushNamed(
                          context,
                          '/order_detail',
                          arguments: order,
                        );
                      },
                      child: SizedBox(
                        height: 140,
                        child:
                            SingleProduct(image: order.products[0].images[0]),
                      ),
                    )
                  : SizedBox(
                      height: 140,
                      child: Center(child: Text("No Image")),
                    );
            },
          );
  }
}
