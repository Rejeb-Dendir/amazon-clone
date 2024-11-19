import 'package:amazon/common/widget/loader.dart';
import 'package:amazon/constants/global_variables.dart';
import 'package:amazon/features/account/services/account_service.dart';
import 'package:amazon/features/account/widgets/product.dart';
import 'package:amazon/models/order.dart';
import 'package:flutter/material.dart';

class Orders extends StatefulWidget {
  const Orders({super.key});

  @override
  State<Orders> createState() => _OrdersState();
}

class _OrdersState extends State<Orders> {
  List<Order>? orders;
  final AccountServices accountServices = AccountServices();
  @override
  void initState() {
    fetchOrders();
    super.initState();
  }

  void fetchOrders() async {
    orders = await accountServices.fetchMyOrders(
      context: context,
    );
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return orders == null
        ? const Loader()
        : Container(
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.only(left: 15),
                      child: const Text(
                        'Your Orders',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.only(right: 15),
                      child: Text(
                        'See all',
                        style: TextStyle(
                          color: GlobalVariables.selectedNavBarColor,
                        ),
                      ),
                    ),
                    //display orders
                  ],
                ),
                Container(
                  height: 170,
                  padding: const EdgeInsets.only(left: 10, top: 20, right: 0),
                  child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: orders!.length,
                      itemBuilder: (context, index) {
                        return orders![index].products.isNotEmpty &&
                                orders![index].products[0].images.isNotEmpty
                            ? GestureDetector(
                                onTap: () {
                                  Navigator.pushNamed(
                                    context,
                                    '/order_detail',
                                    arguments: orders![index],
                                  );
                                },
                                child: SingleProduct(
                                  image: orders![index].products[0].images[0],
                                ),
                              )
                            : SizedBox(); // Or any placeholder widget
                      }),
                ),
              ],
            ),
          );
  }
}
