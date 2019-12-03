import React from "react";
import { Page, Card, Heading } from "@shopify/polaris";

const Help = () => (
  <Page title="Help">
    <Heading>Delivery</Heading>
    <br />
    <Card sectioned title="Where and When do you deliver?">
      <p>
        We deliver to the twin cities and surrounding suburbs. All deliveries
        are on Saturdays between 12pm and 5pm.
      </p>
    </Card>
    <Card
      sectioned
      title="What are my delivery options? Is there a long term commitment?"
    >
      <p>
        You can subscribe to weekly, bi-weekly, or single order. Upon
        subscription, you will be automatically enrolled in a bi-weekly order
        using your original order. You can adjust the details of your order at
        any time. You can also skip deliveries and stop the subscription with us
        whenever you want.
      </p>
    </Card>
    <Card sectioned title="What if I miss my delivery?">
      <p>
        First, email us at{" "}
        <a href="mailto:localguru.io@gmail.com">localguru.io@gmail.com</a> to
        see if your delivery is still out and can be dropped off. If your order
        has already been returned, you can pick it up in South Minneapolis. Your
        order should be ready for pick up after 2:30pm to 4:45pm on Saturday.
      </p>
    </Card>
    <Card sectioned title="What if I want to pick up my order?">
      <p>
        If you prefer to pick up your order, please check the box for pick up.
        You can pick up your order up at our community partner location in South
        Minneapolis. Your order should be ready for pick up from after 12pm to
        4:45pm on Saturday. If you do not pick up your food by 5pm Saturday, you
        can pick up the food Sunday between 10am and 2pm. If you do not pick up
        the food you forfeit the order, as our partner location does not have a
        place to house the food.
      </p>
    </Card>
    <Card sectioned title="Is there a delivery fee?">
      <p>
        All orders under $40 have a $9.99 delivery fee. Any order over $40 is
        eligible for free delivery.
      </p>
    </Card>
    <Card sectioned title="What is your cancellation policy?">
      <p>
        You can change, postpone or cancel your service at any time. The only
        restriction is you must log into your account and make these changes
        before Thursday at 10am prior to your Saturday delivery. If you need to
        cancel after the Thursday at 10am deadline email us at
        localguru.io@gmail.com and we will do our best to accommodate you.
      </p>
    </Card>
    <br />
    <Heading>Billing</Heading>
    <br />
    <Card sectioned title="When do you charge me?">
      <p>The Thursday prior to your Saturday delivery.</p>
    </Card>
    <Card sectioned title="What credit cards do you accept?">
      <p>Visa, and MasterCard credit/debit cards.</p>
    </Card>
    <Card sectioned title="What is your refund policy?">
      <p>
        In the event that you are not satisfied with your order we will refund
        you 100 percent of the charges. If you are unsatisfied with part of your
        order we will either replace, refund or credit your account depending on
        your request.
      </p>
    </Card>
    <Card sectioned title="What happens if my credit card declines?">
      <p>
        If your credit card is declined, we will inform you to update your
        account information. We will pause the delivery until the payment is
        satisfied.
      </p>
    </Card>
    <Card sectioned title="What is your refund policy?">
      <p>
        In the event that you are not satisfied with your order we will refund
        you 100 percent of the charges. If you are unsatisfied with part of your
        order we will either replace, refund or credit your account depending on
        your request.
      </p>
    </Card>
    <br />
    <Heading>Produce</Heading>
    <br />
    <Card sectioned title="What if an item is of poor quality?">
      <p>
        Let us know right away. We expect top quality food just like you do, if
        an unacceptable items gets to you, we will replace it with your next
        order.
      </p>
    </Card>
    <Card sectioned title="Where does the produce come from?">
      <p>
        You get to pick which farmers you prefer to deal with and every item you
        purchase, the site will show you who the food comes from and their
        story.
      </p>
    </Card>
    <Card sectioned title="How fresh is your produce?">
      <p>
        Orders are collected every Saturday morning, and we deliver them
        directly to your door directly from the grower.
      </p>
    </Card>
    <Card
      sectioned
      title="Why is our produce better than what you can buy in the grocery store?"
    >
      <p>
        The produce we deliver is picked and delivered to you, unlike grocery
        store produce that is picked ahead of time to withstand the shipping and
        shelf life of the store. With time, store produce loses its nutrition
        and taste unlike ours, which goes straight to you after delivery from
        producer
      </p>
    </Card>
  </Page>
);

export default Help;
